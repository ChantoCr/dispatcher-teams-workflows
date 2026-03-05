# Flow B expressions (PR#2)

```text
toLower(trim(variables('vText')))
or(equals(variables('vCmd'), '/available'), equals(variables('vCmd'), '/busy'), equals(variables('vCmd'), '/break'), equals(variables('vCmd'), '/lunch'), equals(variables('vCmd'), '/offline'), equals(variables('vCmd'), '/status'), equals(variables('vCmd'), '/queue'), equals(variables('vCmd'), '/who'), equals(variables('vCmd'), '/help'))
equals(item()?['displayName'], variables('vSender'))
equals(toLower(item()?['status']), 'available')
and(equals(toLower(variables('vPreviousStatus')), 'busy'), equals(variables('vNewStatus'), 'available'))
div(length(variables('vOrderedWithoutSender')), 2)
```
