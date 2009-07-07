/*
 * 基于Json解析的动态生成Field的Form
 */ 
hjp.widgets.form.TBDynamicForm = Ext.extend(Ext.FormPanel, {
    initComponent: function() {
        Ext.apply(this, {
            labelWidth: 75,
            url: this.url,
            title: this.title,
            frame: true,
            bodyStyle:'padding:5px 5px 0',
            border: false,
            width: 350,
            defaults: {width: 230},
            defaultType: 'textfield',
            items: this.formItems,
            buttons: [{
                text: '提交'
            }]
        });

        hjp.widgets.form.TBDynamicForm.superclass.initComponent.apply(this, arguments);
    }
});

// 注册为xtype
Ext.reg('hjp.widgets.form.TBDynamicForm', hjp.widgets.form.TBDynamicForm);
