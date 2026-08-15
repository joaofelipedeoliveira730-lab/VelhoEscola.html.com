# VelhoEscola

Jogo educacional mobile-first para HTML/CSS.

## Estrutura
- `index.html`
- `css/style.css`
- `js/script.js`

## GitHub Pages
Envie a pasta para um repositório e ative **Settings → Pages → Deploy from branch**.
O projeto usa CDN para Tailwind e Font Awesome, então não precisa de build.

## Salvamento
O progresso é salvo no `localStorage` do navegador do aparelho.

## Áudio
A música ambiente e os efeitos são sintetizados no navegador via Web Audio API. O áudio começa após o primeiro toque em **Entrar na Escola**, respeitando as regras de autoplay dos celulares.
