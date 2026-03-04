# Flow B expressions

```text
toLower(trim(variables('vText')))
or(
 equals(variables('vCmd'), '/available'),
 equals(variables('vCmd'), '/busy'),
 equals(variables('vCmd'), '/break'),
 equals(variables('vCmd'), '/lunch'),
 equals(variables('vCmd'), '/offline'),
 equals(variables('vCmd'), '/status')
)
equals(item()?['displayName'], variables('vSender'))
and(equals(toLower(previousStatus), 'busy'), equals(variables('vNewStatus'), 'available'))
div(length(variables('vOrderedWithoutSender')), 2)
```
