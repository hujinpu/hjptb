Ext.onReady(function() {
    //setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove: true});
    //}, 1);        

    new Ext.Panel({
        title: 'Test Panel',
        renderTo: Ext.getBody(),
        layout: 'border',
        width: 500,
        height: 500,
        items: [{
            xtype: 'hjp.widgets.tree.TBStrongTree',
            region: 'center',
            loaderUrl: 'datas/tree.json',
            contextMenuUrl: 'datas/tree.json'
        }]
    });
});
