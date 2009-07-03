/*
 * 配置Extjs框架
 */
Ext.BLANK_IMAGE_URL = "../ext-2.2.1/resources/images/default/s.gif";

Ext.QuickTips.init();

Ext.apply(Ext.QuickTips.getQuickTip(), {
    showDelay: 250,
    hideDelay: 300,
    dismissDelay: 0
}); // don't automatically hide quicktip

/*
    Value         Description
    -----------   ----------------------------------------------------------------------
    qtip          Display a quick tip when the user hovers over the field
    title         Display a default browser title attribute popup
    under         Add a block div beneath the field containing the error text
    side          Add an error icon to the right of the field with a popup on hover
    [element id]  Add the error text directly to the innerHTML of the specified element
 */
Ext.form.Field.prototype.msgTarget = 'under';

Ext.Ajax.defaultHeaders = {
    'accept': 'application/json'
};

Ext.lib.Ajax.defaultPostHeader = 'application/json';

Ext.Msg.minWidth = 200;

//layoutOnTabChange Set to true to do a layout of tab items as tabs are changed
Ext.TabPanel.prototype.layoutOnTabChange = true;

Ext.Ajax.timeout=150000 //150秒
