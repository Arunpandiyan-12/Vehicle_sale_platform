import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default user id when not logged in', () => {
    expect(service.getCurrentUserId()).toBe(1);
  });

  it('should handle login', (done) => {
    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.email).toBe('test@example.com');
      done();
    });
  });

  it('should handle logout', () => {
    service.logout();
    expect(service.currentUserValue).toBeNull();
  });

  it('should check role', () => {
    expect(service.hasRole('seller')).toBe(true);
  });
}); 