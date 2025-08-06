# Toast Utils - Mensagens Padronizadas

Este arquivo contém todas as mensagens de notificação padronizadas da aplicação. Todas as mensagens são exibidas em inglês.

## Como usar

Importe o `toastUtils` e use os métodos específicos para cada contexto:

```typescript
import { toastUtils } from './toastUtils';

// Upload de arquivos
toastUtils.upload.success();
toastUtils.upload.success('filename.xlsx');
toastUtils.upload.error();
toastUtils.upload.error('filename.xlsx', 'Invalid format');
toastUtils.upload.dataCleared();

// Filtros
toastUtils.filter.added('Temperature');
toastUtils.filter.removed('Pressure');
toastUtils.filter.allRemoved();
toastUtils.filter.maxReached();

// Zoom
toastUtils.zoom.increased('1.5x');
toastUtils.zoom.decreased('1x');
toastUtils.zoom.maxReached();
toastUtils.zoom.minReached();

// Wells (Poços)
toastUtils.well.selected('Well-A1');
toastUtils.well.notFound();
toastUtils.well.uploadRequired();

// Chat
toastUtils.chat.messageSent();
toastUtils.chat.messageError();
toastUtils.chat.fileUploaded('document.pdf');
toastUtils.chat.fileError();
toastUtils.chat.historyCleared();

// Métodos gerais (usar apenas quando necessário)
toastUtils.success('Custom success message');
toastUtils.error('Custom error message');
toastUtils.warning('Custom warning message');
toastUtils.info('Custom info message');
```

## Regras

1. **Sempre usar métodos específicos** ao invés dos genéricos quando disponível
2. **Todas as mensagens em inglês** para notificações de sucesso/erro
3. **Manter lógica fora dos componentes** - importar apenas onde necessário
4. **Não incluir lógica nos componentes** - usar os métodos padronizados 