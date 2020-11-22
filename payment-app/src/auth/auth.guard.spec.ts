import { AuthPostGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthPostGuard()).toBeDefined();
  });
});
