# Flow A expressions

```text
startsWith(toLower(trim(variables('vText'))), '/next')
contains(variables('vLeaders'), variables('vSender'))
indexOf(variables('vText'), '"')
lastIndexOf(variables('vText'), '"')
or(equals(variables('vFirstQuote'), -1), equals(variables('vLastQuote'), variables('vFirstQuote')))
trim(substring(variables('vText'), 5, sub(variables('vFirstQuote'), 5)))
substring(variables('vText'), add(variables('vFirstQuote'), 1), sub(variables('vLastQuote'), add(variables('vFirstQuote'), 1)))
toLower(trim(variables('vPrefix')))
if(equals(variables('vTagsRaw'), ''), createArray(), split(variables('vTagsRaw'), ' '))
contains(variables('vTags'), 'all')
coalesce(outputs('cLockRow')?['lockUntilUtc'], '1970-01-01T00:00:00Z')
greaterOrEquals(ticks(variables('vNow')), ticks(variables('vLockUntil')))
less(int(item()?['queueOrder']), variables('vMinOrder'))
```
