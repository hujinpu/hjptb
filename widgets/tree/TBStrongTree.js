/*
 * 静态无法拖拽的树，可以通过Json解析，自动生成动态菜单
 * loaderUrl: 加载树数据的url
 * contextMenuUrl：决定是否有右键菜单，以及右键菜单的内容均从这个url指定的Json得到解析和匹配
 */
hjp.widgets.tree.TBStrongTree = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function() {
        Ext.apply(this, {
            autoScroll: true,
            animate: true,
            useArrows: this.contextMenuUrl ? false : true,

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

    // private 右键响应函数
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

    // private 创建右键菜单
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
                        if (!this.win) {
                            this.createWindow();
                        } else {
                            this.win.destroy();
                            delete this.win;
                            this.createWindow();
                        }
                        //Ext.Msg.alert('提示', '你点击了' + itemsObj.name);
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

    // private 创建右键菜单点击后探出的Window
    createWindow: function() {
        Ext.Ajax.request({
            url: 'datas/fieldJson.json',
            success: function(response) {
                var jsonDataString = response.responseText;
                // 创建表单域
                function createField (desObj) {
                    return {
                        fieldLabel: desObj.name,
                        name: desObj.column,
                        allowBlank: false
                    };  
                };
                
                try {
                    var jsonObj = eval('(' + jsonDataString + ')'); // 记录层次可嵌套关系
                    var formItems = [];
                    Ext.each(jsonObj.dataset.typevo.properties.propertyvo, function(el) {
                        formItems.push(createField(el));
                    }, this);

                    this.win = new Ext.Window({
                        layout: 'fit',
                        width: 500,
                        height: 300,
                        closeAction: 'hide',
                        plain: true,
                        modal: true,
                        items: {
                            xtype: 'hjp.widgets.form.TBDynamicForm',
                            url: 'submiturl',
                            formItems: formItems,
                            title: '表单标题'
                        }
                    });
                    this.win.show();

                } catch (e) {
                    Ext.Msg.alert('提示', response);
                }
            },
            failure: function(response) {
                Ext.Msg.alert('提示', response);
            },
            scope: this
        });
    },

    // private 响应右键菜单消失
    onContextHide: function() {
        if (this.ctxNode) {
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    }
});

// 注册为xtype
Ext.reg('hjp.widgets.tree.TBStrongTree', hjp.widgets.tree.TBStrongTree);
