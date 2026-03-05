# Flow C expressions (admin)

```text
startsWith(toLower(trim(variables('vText'))), '/admin')
contains(concat(',', toLower(variables('vLeadersCsv')), ','), concat(',', toLower(variables('vSender')), ','))
startsWith(toLower(trim(variables('vText'))), '/admin add ')
startsWith(toLower(trim(variables('vText'))), '/admin remove ')
startsWith(toLower(trim(variables('vText'))), '/admin boost ')
equals(toLower(trim(variables('vText'))), '/admin reset')
startsWith(toLower(trim(variables('vText'))), '/admin leaders set ')
equals(toLower(trim(variables('vText'))), '/admin config show')
add(variables('vMaxQueueOrder'), 1)
```
