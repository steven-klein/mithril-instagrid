import Grid from './view/components/grid';

/* Import all vendor.scss / css here[e.g. Import 'font-awesome/scss/font-awesome.scss';] */

/* Include global app styles here, so that it will over ride component's css styles*/
import './app.scss';

if (module.hot) {
    module.hot.accept();
}

document.querySelectorAll('[data-instagram-grid]').forEach((el) => {
    m.mount(el, {
        view() {
            return m(Grid, {
                id: el.getAttribute('data-instagram-grid') || null,
                count: el.getAttribute('data-instagram-grid-count') || 12,
            });
        },
    });
});
