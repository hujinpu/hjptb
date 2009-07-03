/*
 * 解析TB专有的JSON格式
 */
hjp.widgets.tree.TBJsonTreeLoader = Ext.extend(Ext.tree.TreeLoader, {
    
    // private override
    processResponse: function(response, node, callback){
        var jsonDataString = response.responseText;
        
        try {
            var jsonData = eval('(' + jsonDataString + ')');
            node.beginUpdate();
            node.appendChild(this.parseJson(jsonData.dataset.dic));
            node.endUpdate();
            
            if (typeof callback == 'function') {
                callback(this, node);
            }
        } catch(e) {
            this.handleFailure(response);
        }
    },
    
    // private
    parseJson: function(node) {
        var nodes = [];
        if (node instanceof Array) {
            Ext.each(node, function(el) {
                var treeNode = this.createNode(el);
                if (el.children && el.children.dic) {
                    treeNode.appendChild(this.parseJson(el.children.dic));
                }
                nodes.push(treeNode);
            }, this);
        } else {
            var treeNode = this.createNode(node);
            nodes.push(treeNode);
        }

        return nodes;
    },
    
    // private override
    createNode: function(node) {
        var attr = {};
        
        for (var i in node) {
            if (i == 'children') continue;
            attr[i] = node[i];
        }
        
        attr.leaf = attr.hasChild == 'true' ? false : true;
        attr.text = attr.name;

        /*
         * 修改后的TreeLoader中的createNode方法
         */
        if (this.baseAttrs) {
            Ext.applyIf(attr, this.baseAttrs);
        }
        if (this.applyLoader !== false) {
            attr.loader = this;
        }
        if (typeof attr.uiProvider == 'string') {
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        if (attr.nodeType) {
            return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
        } else {
            return new Ext.tree.TreeNode(attr);
        }
    }
});
