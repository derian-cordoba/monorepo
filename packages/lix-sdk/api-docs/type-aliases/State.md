[**@lix-js/sdk**](../README.md)

***

[@lix-js/sdk](../README.md) / State

# Type Alias: State\<T\>

> **State**\<`T`\> = [`LixSelectable`](LixSelectable.md)\<[`EntityStateView`](EntityStateView.md)\<`T`\>\>

Defined in: [packages/lix-sdk/src/entity-views/types.ts:146](https://github.com/opral/monorepo/blob/3025726c2bce8185b41ef0b1b2f7cc069ebcf2b0/packages/lix-sdk/src/entity-views/types.ts#L146)

Type for querying entities from the active version.

This type unwraps all LixGenerated markers, giving you the actual runtime types
for entity properties and operational columns. Use this when working with
query results from the database or passing data to UI components.

All properties are required and have their actual types (no LixGenerated wrappers).

## Type Parameters

### T

`T`

## Example

```typescript
// Use State type for UI components that display entity data
interface SettingsCardProps {
  setting: State<KeyValue>;
}

function SettingsCard({ setting }: SettingsCardProps) {
  return (
    <div>
      <h3>{setting.key}</h3>
      <p>{setting.value}</p>
      <time>{setting.lixcol_updated_at}</time>
    </div>
  );
}

// Query and pass to UI
const settings = await lix.db
  .selectFrom("key_value")
  .selectAll()
  .execute();

settings.map(setting => <SettingsCard setting={setting} />);
```
