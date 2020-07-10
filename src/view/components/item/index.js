import debounce from 'debounce';
import { uri } from '../../../modules/config';

function setGridEnd(item) {
    // calculate row span for layout.
    let grid = document.getElementsByClassName('instagrid-list')[0],
        rowGap = parseFloat(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
        rowHeight = parseFloat(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    let rowSpan = Math.ceil(
        (item.querySelector('.instagrid-item-contents').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap),
    );
    item.style.gridRowEnd = 'span ' + rowSpan;
}

export default () => {
    return {
        oninit(vnode) {
            vnode.attrs.loaded = false;

        },
        oncreate(vnode) {
            window.addEventListener('resize', debounce(() => {
                setGridEnd(vnode.dom);
            }, 200));
            setGridEnd(vnode.dom);
        },
        view(vnode) {
            return m('li.instagrid-item', [
                m('.instagrid-item-contents', [
                    m('a.instagrid-link',
                        {
                            href: `${uri}p/${vnode.attrs.shortcode}`,
                        },
                        m(
                            '.instagrid-img-container',
                            {
                                style: `padding-bottom:${
                                    (vnode.attrs.dimensions.height / vnode.attrs.dimensions.width) * 100
                                }%`,
                                class: (vnode.attrs.loaded) ? 'instagrid-img-loaded' : null,
                            },
                            m('img.instagrid-img', {
                                src: vnode.attrs.display_url,
                                height: vnode.attrs.dimensions.height,
                                width: vnode.attrs.dimensions.width,
                                alt: vnode.attrs.accessibility_caption,
                                onload: () => {
                                    vnode.attrs.loaded = true;
                                },
                            }),
                        ),
                    ),
                ]),
            ]);
        },
    };
};
