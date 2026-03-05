# Flow A expressions (PR#2)

```text
startsWith(toLower(trim(variables('vText'))), '/next')
or(equals(toLower(trim(variables('vText'))), '/help'), equals(toLower(trim(variables('vText'))), '/next help'))
indexOf(variables('vText'), '"')
lastIndexOf(variables('vText'), '"')
or(equals(variables('vFirstQuote'), -1), equals(variables('vLastQuote'), variables('vFirstQuote')))
trim(substring(variables('vText'), 5, sub(variables('vFirstQuote'), 5)))
substring(variables('vText'), add(variables('vFirstQuote'), 1), sub(variables('vLastQuote'), add(variables('vFirstQuote'), 1)))
if(equals(toLower(trim(variables('vPrefix'))), ''), createArray(), split(toLower(trim(variables('vPrefix'))), ' '))
contains(variables('vTags'), 'all')
contains(concat(',', toLower(variables('vAllowedTagsCsv')), ','), concat(',', item(), ','))
greaterOrEquals(ticks(variables('vNow')), ticks(variables('vLockUntil')))
less(int(item()?['queueOrder']), variables('vMinOrder'))
```
