# El Jimador

### Instalar dependencias

```npm install```

### Levantar Servidor

```npm start```

### Hacer Build

```npm run build```

## Deploy 

```npm run deploy```

UA-75726738-1

# comando para resize imagenes recursivamente (reemplaza la misma image)
```
find . -name "*.jpg" | xargs mogrify -resize 50%
```
# comando para resize imagenes recursivamente (genera otra imagen con el nombre.th)

```
find . -name "*.jpg" | xargs -n 1 sh -c 'convert -resize 170x170 $0 $(echo $0 | sed 's/\.jpg/-th\.jpg/')'
```