# Flow chat expressions (copy/paste)

## 1) Enforce allow-list
```text
and(
  equals(toLower(variables('vEnforceChatAllowList')), 'true'),
  not(contains(concat(',', toLower(variables('vAllowedChatIdsCsv')), ','), concat(',', toLower(variables('vChatId')), ',')))
)
```

## 2) Chat permitido
```text
contains(concat(',', toLower(variables('vAllowedChatIdsCsv')), ','), concat(',', toLower(variables('vChatId')), ','))
```

## 3) Terminación silenciosa (rama no permitida)
- Acción: `Terminate`
- Estado: `Succeeded`
- Mensaje opcional interno: `wrong-chat`
