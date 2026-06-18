# Paula Morna Dória — Official Website

Site oficial de Paula Morna Dória, soprano lírica internacional.

## Estrutura

```
index.html              → página principal (todas as 9 secções/páginas)
css/style.css            → todos os estilos
js/main.js                → toda a lógica (navegação, idioma, player, etc.)
assets/images/            → fotografias e certificados
assets/video/              → vídeo de recital embutido
```

## Como publicar

### GitHub Pages (gratuito)
1. Crie um repositório novo no GitHub.
2. Faça upload de todos os ficheiros e pastas exatamente como estão (mantenha a estrutura de pastas).
3. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
4. O site fica disponível em `https://seu-usuario.github.io/nome-do-repositorio/`.

### Qualquer outro alojamento (Hostinger, Netlify, etc.)
Basta fazer upload de todos os ficheiros e pastas para a raiz do alojamento, mantendo a mesma estrutura de pastas (`css/`, `js/`, `assets/`). Não é necessário nenhum servidor especial — é só HTML, CSS e JS estáticos.

## Notas importantes

- O site **não funciona corretamente abrindo o `index.html` diretamente a partir do disco** (duplo clique) devido a restrições de segurança dos navegadores com vídeo. É necessário um servidor web (mesmo local) ou alojamento online.
- Todas as imagens e o vídeo já estão otimizados em tamanho.
- O idioma por defeito é inglês, com alternância para português de Portugal no canto superior direito.
- Para trocar qualquer foto, certificado ou o vídeo, basta substituir o ficheiro correspondente em `assets/` mantendo o mesmo nome, ou atualizar o caminho no `index.html`.
