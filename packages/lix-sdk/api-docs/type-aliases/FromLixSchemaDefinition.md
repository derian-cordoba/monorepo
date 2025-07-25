[**@lix-js/sdk**](../README.md)

***

[@lix-js/sdk](../README.md) / FromLixSchemaDefinition

# Type Alias: FromLixSchemaDefinition\<T\>

> **FromLixSchemaDefinition**\<`T`\> = `ApplyLixGenerated`\<`T`\>

Defined in: [packages/lix-sdk/src/schema-definition/definition.ts:444](https://github.com/opral/monorepo/blob/3025726c2bce8185b41ef0b1b2f7cc069ebcf2b0/packages/lix-sdk/src/schema-definition/definition.ts#L444)

Convert a LixSchemaDefinition to a TypeScript type.

This type transformation:
1. Converts JSON Schema properties to TypeScript types
2. Wraps properties with `x-lix-generated: true` in LixGenerated markers
3. Transforms `type: "object"` without properties to `Record<string, any>`

The resulting type can be used with LixInsertable, LixUpdateable, and
LixSelectable for database operations.

## Type Parameters

### T

`T` *extends* [`LixSchemaDefinition`](LixSchemaDefinition.md)

## Example

```typescript
const AccountSchema = {
  "x-lix-key": "account",
  "x-lix-version": "1.0",
  "x-lix-primary-key": ["id"],
  type: "object",
  properties: {
    id: { type: "string", "x-lix-generated": true },
    name: { type: "string" },
    email: { type: "string" },
    metadata: { type: "object" },  // Becomes Record<string, any>
    created_at: { type: "string", "x-lix-generated": true }
  },
  required: ["id", "name", "email"],
  additionalProperties: false
} as const satisfies LixSchemaDefinition;

type Account = FromLixSchemaDefinition<typeof AccountSchema>;
// Result: {
//   id: LixGenerated<string>;
//   name: string;
//   email: string;
//   metadata: Record<string, any> | undefined;
//   created_at: LixGenerated<string> | undefined;
// }
```
