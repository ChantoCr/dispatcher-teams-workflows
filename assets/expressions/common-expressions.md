# Common expressions (copy/paste)

```text
utcNow()
toLower(trim(variables('vText')))
contains(concat(',', toLower(variables('vLeadersCsv')), ','), concat(',', toLower(variables('vSender')), ','))
contains(concat(',', variables('vAllowedTagsCsv'), ','), concat(',', item(), ','))
coalesce(outputs('cConfigRow')?['helpText'], 'Sin ayuda configurada')
coalesce(outputs('cLockRow')?['lockUntilUtc'], '1970-01-01T00:00:00Z')
greaterOrEquals(ticks(utcNow()), ticks(variables('vLockUntil')))
addSeconds(utcNow(), int(variables('vLockTtlSeconds')))
```
