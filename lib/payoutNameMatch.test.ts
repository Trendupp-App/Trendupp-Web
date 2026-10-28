import type { AuthUser } from '@/store/authStore';
import { accountNameMatches, getPayoutNameTarget } from './payoutNameMatch';

const creator = { role: 'creator', firstName: 'Alex', lastName: 'Okafor' } as AuthUser;
const brand = { role: 'brand', firstName: '', lastName: '', username: 'Moka Tech' } as AuthUser;

describe('creator payout name', () => {
  const target = getPayoutNameTarget(creator)!;

  it.each(['Alex Okafor', 'ALEX OKAFOR', 'Okafor Alex', 'Alex Chukwu Okafor', 'okafor, alex c.'])(
    'accepts %s',
    (name) => expect(accountNameMatches(name, target)).toBe(true),
  );

  it.each(['John Doe', 'Alex Smith', 'Okafor', 'Mary Okafor'])('rejects %s', (name) =>
    expect(accountNameMatches(name, target)).toBe(false),
  );
});

describe('brand payout name', () => {
  const target = getPayoutNameTarget(brand)!;

  it.each(['Moka Tech', 'MOKA TECH LTD', 'Moka Technologies Limited', 'Moka Tech Nigeria Ltd'])(
    'accepts %s',
    (name) => expect(accountNameMatches(name, target)).toBe(true),
  );

  it.each(['Alex Okafor', 'Moka Foods Ltd', 'Tech Hub Ltd'])('rejects %s', (name) =>
    expect(accountNameMatches(name, target)).toBe(false),
  );
});

describe('missing profile name', () => {
  it('returns no target, so the check is skipped', () => {
    expect(getPayoutNameTarget({ role: 'brand', username: '' } as AuthUser)).toBeNull();
    expect(
      getPayoutNameTarget({ role: 'creator', firstName: '', lastName: '' } as AuthUser),
    ).toBeNull();
  });
});
