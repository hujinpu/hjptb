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
            Ext.Ajax.request({
                url: this.contextMenuUrl,
                success: function(response) {
                    var jsonDataString = response.responseText;
                    
                    try {
                        this.typesData = eval('(' + jsonDataString + ')').dataset; // 记录层次可嵌套关系
                    } catch(e) {
                        Ext.Msg.alert('提示', response);
                    }
                    this.on('contextmenu', this.onContextMenu, this);
                },
                failure: function(response) {
                    Ext.Msg.alert('提示', response);
                },
                scope: this
            });
            
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
        if (!this.menu) {
            this.createContextMenu(node);
        } else {
            this.menu.destroy();
            delete this.menu;
            this.createContextMenu(node);
        }

        if (this.menu) {
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menu.showAt(e.getXY());
        }
    },

    // private
    createContextMenu: function(node) {
        var menuItems = [];
        var objbaseview = this.typesData.objbaseview;
        var matchObj = null;
        
        (function(objs, nodeName) {
            var _thisFunc = arguments.callee;
            if (objs instanceof Array) {
                Ext.each(objs, function(el) {
                    if (el.name && (el.name == nodeName)) {
                        matchObj = el;
                        return false;
                    } else if (el.children.objbaseview) {
                        _thisFunc.call(this, el.children.objbaseview, nodeName)    
                    }
                }, this);
            } else {
                if (objs.name && (objs.name == nodeName)) {
                    matchObj = objs;
                    return false;
                } else if (objs.children.objbaseview) {
                    _thisFunc.call(this, objs.children.objbaseview, nodeName)    
                }
            }
        })(objbaseview, node.attributes.name);

        // 匹配成功则增加右键菜单项
        if (matchObj) {
            var itemsObj = matchObj.children.objbaseview;
            if (itemsObj instanceof Array) {
                Ext.each(itemsObj, function(el) {
                    menuItems.push({
                        text: itemsObj.name,
                        handler: function() {
                            Ext.Msg.alert('提示', '你点击了' + itemsObj.name);
                        },
                        scope: this
                    });
                }, this);
                menuItems.push('-');
                menuItems.push({
                    text: '删除',
                    handler: function() {
                        Ext.Msg.alert('提示', '你将删除' + nodeName);
                    },
                    scope: this
                });
            } else if (itemsObj) {
                menuItems.push({
                    text: itemsObj.name,
                    handler: function() {
                        Ext.Msg.alert('提示', '你点击了' + itemsObj.name);
                    },
                    scope: this
                });
                menuItems.push('-');
                menuItems.push({
                    text: '删除',
                    handler: function() {
                        Ext.Msg.alert('提示', '你将删除' + node.attributes.name);
                    },
                    scope: this
                });
            }
        } 
        if (menuItems.length > 0) {
            this.menu = new Ext.menu.Menu({items: menuItems});
            this.menu.on('hide', this.onContextHide, this);
        }
    },

    // private
    onContextHide: function() {
        if (this.ctxNode) {
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    }
});

// 注册为xtype
Ext.reg('hjp.widgets.tree.TBStrongTree', hjp.widgets.tree.TBStrongTree);
