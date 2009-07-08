Ext.onReady(function() {
    /*
    setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove: true});
    }, 300);        
    */
    new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'west',
            collapsible: true,
            title: '导航',
            xtype: 'hjp.widgets.tree.TBStrongTree',
            width: 200,
            autoScroll: true,
            split: true,
            loaderUrl: 'datas/tree.json'
        }, {
            title: '内容面板',
            region: 'center',
            xtype: 'panel',
            layout: 'border',
            items: [{
                region: 'west',
                collapsible: true,
                title: '结构树',
                xtype: 'hjp.widgets.tree.TBStrongTree',
                width: 200,
                autoScroll: true,
                split: true,
                loaderUrl: 'datas/tree.json',
                contextMenuUrl: 'datas/treeType.json',
                listeners: {
                    click: function(node) {
                        var ct = Ext.getCmp('center-tabpanel');
                        ct.removeAll();
                        Ext.each(node.childNodes, function(el) {
                            ct.add({
                                title: el.text,
                                html: el.text + '的相关内容'
                            });
                        });
                        ct.setActiveTab(0);
                    }
                }
            }, {
                id: 'center-tabpanel',
                region: 'center',
                xtype: 'tabpanel',
                autoDestroy: true,
                enableTabScroll: true,
                defaults: {autoScroll: true}
            }]
        }]
    });
});
