import * as Factory from 'factory.ts';
import { random } from 'faker';

export const PermissionFactory = Factory.Async.makeFactory({
    id: random.number({ min: 0, max: 500}),
    slug: random.word(),
    description: random.words(),
    active: random.boolean()
});