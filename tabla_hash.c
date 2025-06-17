#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TAM_HASH 20

// ------------------ ESTRUCTURAS ------------------
typedef struct Traduccion {
    char frase_es[128];
    struct Traduccion* siguiente;
} Traduccion;

typedef struct FraseNodo {
    char frase_en[128];
    Traduccion* traducciones;
    struct FraseNodo* siguiente;
} FraseNodo;

// Inicializar la tabla hash en NULL
FraseNodo* tabla_hash[TAM_HASH] = {NULL};

// ------------------ FUNCIONES AUXILIARES ------------------

// Trim izquierdo
char* ltrim(char* s) {
    while (*s == ' ' || *s == '\t' || *s == '\n' || *s == '\r') s++;
    return s;
}

// Trim derecho
void rtrim(char* s) {
    int len = strlen(s);
    while (len > 0 && (s[len - 1] == ' ' || s[len - 1] == '\t' || s[len - 1] == '\n' || s[len - 1] == '\r'))
        s[--len] = '\0';
}

// Hash simple basado en suma ASCII
int calcularHash(const char* frase) {
    int hash = 0;
    while (*frase) hash += (unsigned char)*frase++;
    return hash % TAM_HASH;
}

// ------------------ OPERACIONES HASH ------------------

int insertarTraduccion(const char* en, const char* es) {
    // Validar entrada
    if (!en || !es || strlen(en) == 0 || strlen(es) == 0) {
        printf("Error: frase vacía o inválida\n");
        return 0;
    }
    
    // Verificar longitud
    if (strlen(en) >= 128 || strlen(es) >= 128) {
        printf("Error: frase demasiado larga (máximo 127 caracteres)\n");
        return 0;
    }
    
    int indice = calcularHash(en);
    FraseNodo* actual = tabla_hash[indice];

    // Buscar si ya existe la frase en inglés
    while (actual) {
        if (strcmp(actual->frase_en, en) == 0) {
            // Verificar si la traducción ya existe
            Traduccion* t = actual->traducciones;
            while (t) {
                if (strcmp(t->frase_es, es) == 0)
                    return 1; // Ya existe, no es error
                t = t->siguiente;
            }
            // Insertar nueva traducción al frente de la lista
            Traduccion* nueva = malloc(sizeof(Traduccion));
            if (!nueva) {
                printf("Error: no se pudo asignar memoria\n");
                return 0;
            }
            strcpy(nueva->frase_es, es);
            nueva->siguiente = actual->traducciones;
            actual->traducciones = nueva;
            return 1;
        }
        actual = actual->siguiente;
    }

    // Crear nuevo nodo para frase en inglés
    FraseNodo* nuevo = malloc(sizeof(FraseNodo));
    if (!nuevo) {
        printf("Error: no se pudo asignar memoria\n");
        return 0;
    }
    strcpy(nuevo->frase_en, en);
    nuevo->traducciones = NULL;
    nuevo->siguiente = tabla_hash[indice];
    tabla_hash[indice] = nuevo;

    // Crear primera traducción
    Traduccion* nuevaTrad = malloc(sizeof(Traduccion));
    if (!nuevaTrad) {
        printf("Error: no se pudo asignar memoria\n");
        // Limpiar el nodo creado previamente
        free(nuevo);
        tabla_hash[indice] = tabla_hash[indice]->siguiente;
        return 0;
    }
    strcpy(nuevaTrad->frase_es, es);
    nuevaTrad->siguiente = NULL;
    nuevo->traducciones = nuevaTrad;
    
    return 1;
}

void buscarTraduccion(const char* en) {
    if (!en || strlen(en) == 0) {
        printf("\nFrase vacía\n");
        return;
    }
    
    int indice = calcularHash(en);
    FraseNodo* actual = tabla_hash[indice];

    while (actual) {
        if (strcmp(actual->frase_en, en) == 0) {
            printf("\nTraducciones de \"%s\":\n", en);
            Traduccion* t = actual->traducciones;
            int i = 1;
            while (t) {
                printf("  %d. %s\n", i++, t->frase_es);
                t = t->siguiente;
            }
            return;
        }
        actual = actual->siguiente;
    }
    printf("\nFrase no encontrada: \"%s\"\n", en);
}

int cargarFrases(const char* archivo) {
    FILE* f = fopen(archivo, "r");
    if (!f) {
        printf("Error: no se pudo abrir el archivo '%s'\n", archivo);
        printf("Asegúrate de que el archivo existe y tienes permisos de lectura.\n");
        return 0;
    }

    char linea[256];
    int lineas_procesadas = 0;
    int lineas_exitosas = 0;
    
    while (fgets(linea, sizeof(linea), f)) {
        lineas_procesadas++;
        
        // Buscar el separador (tabulación)
        char* separador = strchr(linea, '\t');
        if (!separador) {
            printf("Advertencia línea %d: formato incorrecto (falta tabulación)\n", lineas_procesadas);
            continue;
        }
        
        // Dividir la línea en inglés y español
        *separador = '\0';  // Reemplazar tabulación con terminador
        char* en = linea;
        char* es = separador + 1;
        
        // Limpiar espacios y saltos de línea
        en = ltrim(en); rtrim(en);
        es = ltrim(es); rtrim(es);
        
        // Verificar que ambas partes no estén vacías
        if (strlen(en) > 0 && strlen(es) > 0) {
            if (insertarTraduccion(en, es)) {
                lineas_exitosas++;
            }
        } else {
            printf("Advertencia línea %d: frase vacía\n", lineas_procesadas);
        }
    }

    fclose(f);
    printf("Archivo cargado: %d/%d líneas procesadas exitosamente\n", 
           lineas_exitosas, lineas_procesadas);
    return lineas_exitosas > 0;
}

void liberarMemoria() {
    for (int i = 0; i < TAM_HASH; i++) {
        FraseNodo* actual = tabla_hash[i];
        while (actual) {
            // Liberar todas las traducciones
            Traduccion* t = actual->traducciones;
            while (t) {
                Traduccion* tmp = t;
                t = t->siguiente;
                free(tmp);
            }
            // Liberar el nodo de frase
            FraseNodo* tmpF = actual;
            actual = actual->siguiente;
            free(tmpF);
        }
        tabla_hash[i] = NULL;  // Reinicializar
    }
}

void mostrarEstadisticas() {
    int total_frases = 0;
    int total_traducciones = 0;
    
    for (int i = 0; i < TAM_HASH; i++) {
        FraseNodo* actual = tabla_hash[i];
        while (actual) {
            total_frases++;
            Traduccion* t = actual->traducciones;
            while (t) {
                total_traducciones++;
                t = t->siguiente;
            }
            actual = actual->siguiente;
        }
    }
    
    printf("\nEstadísticas del diccionario:\n");
    printf("   - Frases en inglés: %d\n", total_frases);
    printf("   - Total de traducciones: %d\n", total_traducciones);
}

// ------------------ MAIN ------------------

int main() {
    // Configurar codificación UTF-8 (Windows)
    #ifdef _WIN32
    system("chcp 65001 > nul");
    #endif
    
    printf("=== Traductor Inglés → Español ===\n");
    
    // Intentar cargar el archivo
    if (!cargarFrases("frases.txt")) {
        printf("\nNo se pudo cargar el diccionario. Continuando con diccionario vacío.\n");
        printf("Formato esperado del archivo 'frases.txt':\n");
        printf("Hello\tHola\n");
        printf("Good morning\tBuenos días\n");
        printf("How are you?\t¿Cómo estás?\n\n");
    }
    
    mostrarEstadisticas();
    printf("\nEscribe una frase en inglés (o escribe 'salir' para terminar)\n");
    printf("También puedes usar 'stats' para ver estadísticas\n\n");

    char entrada[128];
    while (1) {
        printf("Frase en inglés: ");
        
        if (!fgets(entrada, sizeof(entrada), stdin)) {
            printf("\nError leyendo entrada\n");
            break;
        }
        
        // Remover salto de línea y espacios
        entrada[strcspn(entrada, "\n")] = '\0';
        char* limpia = ltrim(entrada);
        rtrim(limpia);

        if (strcmp(limpia, "salir") == 0) {
            break;
        } else if (strcmp(limpia, "stats") == 0) {
            mostrarEstadisticas();
        } else if (strlen(limpia) == 0) {
            printf("Por favor ingresa una frase válida\n");
        } else {
            buscarTraduccion(limpia);
        }
        printf("\n");
    }

    liberarMemoria();
    printf("Memoria liberada. ¡Hasta luego!\n");
    return 0;
}