// main.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "lista_enlazada.h"

#define HASH_SIZE 100
Frase* tabla_hash[HASH_SIZE];

// Función hash simple
unsigned int hash(const char *str) {
    unsigned int h = 0;
    while (*str) {
        h += (unsigned char)(*str++);
    }
    return h % HASH_SIZE;
}

void insertar_en_tabla(const char *frase, const char *traduccion) {
    unsigned int indice = hash(frase);
    insertar_frase(&tabla_hash[indice], frase, traduccion);
}

Frase* buscar_en_tabla(const char *frase) {
    unsigned int indice = hash(frase);
    return buscar_frase(tabla_hash[indice], frase);
}

void liberar_tabla() {
    for (int i = 0; i < HASH_SIZE; i++) {
        if (tabla_hash[i]) {
            liberar_frases(tabla_hash[i]);
            tabla_hash[i] = NULL;
        }
    }
}

void cargar_archivo(const char *nombre_archivo) {
    FILE *archivo = fopen(nombre_archivo, "r");
    if (!archivo) {
        perror("Error al abrir frases.txt");
        exit(EXIT_FAILURE);
    }

    char ingles[128], espanol[128];
    while (fscanf(archivo, "%127[^\t]\t%127[^\n]\n", ingles, espanol) == 2) {
        insertar_en_tabla(ingles, espanol);
    }

    fclose(archivo);
}

int main() {
    cargar_archivo("frases.txt");

    printf("=== Traductor Inglés -> Español ===\n");
    char entrada[128];

    while (1) {
        printf("\nIntroduce una frase en inglés (o 'salir'): ");
        fgets(entrada, sizeof(entrada), stdin);
        entrada[strcspn(entrada, "\n")] = 0;

        if (strcmp(entrada, "salir") == 0)
            break;

        Frase *f = buscar_en_tabla(entrada);
        if (f) {
            printf("Traducciones:\n");
            Traduccion *t = f->traducciones;
            while (t) {
                printf(" - %s\n", t->texto);
                t = t->siguiente;
            }
        } else {
            printf("Frase no encontrada.\n");
        }
    }

    liberar_tabla();
    return 0;
}
