// lista_enlazada.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "lista_enlazada.h"

void insertar_traduccion(Frase *frase, const char *traduccion) {
    Traduccion *nueva = (Traduccion *)malloc(sizeof(Traduccion));
    strcpy(nueva->texto, traduccion);
    nueva->siguiente = frase->traducciones;
    frase->traducciones = nueva;
}

Frase* crear_frase(const char *texto_frase, const char *traduccion) {
    Frase *nueva = (Frase *)malloc(sizeof(Frase));
    strcpy(nueva->texto, texto_frase);
    nueva->traducciones = NULL;
    nueva->siguiente = NULL;
    insertar_traduccion(nueva, traduccion);
    return nueva;
}

Frase* buscar_frase(Frase *lista, const char *texto_frase) {
    while (lista) {
        if (strcmp(lista->texto, texto_frase) == 0) {
            return lista;
        }
        lista = lista->siguiente;
    }
    return NULL;
}

void insertar_frase(Frase **lista, const char *texto_frase, const char *traduccion) {
    Frase *encontrada = buscar_frase(*lista, texto_frase);
    if (encontrada) {
        insertar_traduccion(encontrada, traduccion);
    } else {
        Frase *nueva = crear_frase(texto_frase, traduccion);
        nueva->siguiente = *lista;
        *lista = nueva;
    }
}

void mostrar_frases(Frase *lista) {
    while (lista) {
        printf("Frase: %s\n", lista->texto);
        Traduccion *t = lista->traducciones;
        while (t) {
            printf("  - %s\n", t->texto);
            t = t->siguiente;
        }
        lista = lista->siguiente;
    }
}

void liberar_frases(Frase *lista) {
    while (lista) {
        Traduccion *t = lista->traducciones;
        while (t) {
            Traduccion *tmp = t;
            t = t->siguiente;
            free(tmp);
        }
        Frase *tmp = lista;
        lista = lista->siguiente;
        free(tmp);
    }
}
