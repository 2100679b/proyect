// lista_enlazada.h
#ifndef LISTA_ENLAZADA_H
#define LISTA_ENLAZADA_H

typedef struct Traduccion {
    char texto[128];
    struct Traduccion *siguiente;
} Traduccion;

typedef struct Frase {
    char texto[128];
    Traduccion *traducciones;
    struct Frase *siguiente;
} Frase;

Frase* buscar_frase(Frase *lista, const char *texto_frase);
void insertar_traduccion(Frase *frase, const char *traduccion);
Frase* crear_frase(const char *texto_frase, const char *traduccion);
void insertar_frase(Frase **lista, const char *texto_frase, const char *traduccion);
void mostrar_frases(Frase *lista);
void liberar_frases(Frase *lista);

#endif
