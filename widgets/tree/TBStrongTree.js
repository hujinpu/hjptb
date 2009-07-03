/*
 * 不能拖拽的静态树，一般用于导航，或者单项选择。
 */
hjp.widgets.tree.TBStrongTree = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function() {
        Ext.apply(this, {
            autoScroll: true,
            animate: true,

            root: new Ext.tree.AsyncTreeNode({
                text: 'TBStrongTreeRoot'
            }),

            loader: new hjp.widgets.tree.TBJsonTreeLoader({
                url: this.loaderUrl,
                processAttributes: this.processAttributes
            }),

            rootVisible: false,
            border: false,
            containerScroll: true
        });
        
        if (this.contextMenuUrl) {
            this.on('contextmenu', this.onContextMenu, this);
        }

        hjp.widgets.tree.TBStrongTree.superclass.initComponent.apply(this, arguments);
    },
    
    afterRender: function() {
        this.el.on('contextmenu', function(e) {
            e.preventDefault();
        });

        hjp.widgets.tree.TBStrongTree.superclass.afterRender.call(this);
    },

    onContextMenu: function(node, e) {
        if (!this.menu) { // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                items: [{
                    text:'哈哈',
                    scope: this
                }, '-', {
                    text:'刷新',
                    scope: this,
                    handler: function() {
                        Ext.Msg.alert('提示', '刷新');
                    }
                },{
                    text:'删除',
                    scope: this,
                    handler: function(){
                        Ext.Msg.alert('提示', '删除');
                    }
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }

        this.ctxNode = node;
        this.ctxNode.ui.addClass('x-node-ctx');
        this.menu.showAt(e.getXY());
    },

    onContextHide: function() {
        if (this.ctxNode) {
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    }
});

// 注册为xtype
Ext.reg('hjp.widgets.tree.TBStrongTree', hjp.widgets.tree.TBStrongTree);
