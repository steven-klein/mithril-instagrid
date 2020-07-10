import { extractData } from '../../../modules/helpers';
import { uri } from '../../../modules/config';
import store from '../../../modules/store';
import GridItem from '../item';
import SplashLoader from '../splash-loader';

function filterData(id, data) {
    return data.filter((item) => { 
        return (item.node.owner.username === id && item.node.is_video === false);
    });
}

export default () => {
    return {
        oninit(vnode) {
            vnode.state.store = store(uri + vnode.attrs.id, {
                request: {
                    responseType: 'document',
                    deserialize: (document) => {
                        return extractData(document);
                    },
                },
            });

            vnode.state.store.fetch();
        },
        view(vnode) {
            return (vnode.state.store.loading) ?
                m(SplashLoader) :
                ((vnode.state.store.data !== null) ?
                    m('ul.instagrid-list', filterData(
                        vnode.attrs.id,
                        vnode.state.store.data.user.edge_owner_to_timeline_media.edges,
                    ).slice(0, 9).map((item) => {
                        return m(GridItem, item.node);
                    })) : null
                );
        },
    };
};