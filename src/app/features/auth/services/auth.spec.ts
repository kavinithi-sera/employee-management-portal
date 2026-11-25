import { TestBed } from '@angular/core/testing';

import {
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import { AuthService } from './auth';

describe('AuthService', () => {

  let service: AuthService;


  beforeEach(() => {

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    service =
      TestBed.inject(AuthService);

  });


  it(
    'should start logged out',
    () => {

      expect(
        service.isLoggedIn()
      ).toBe(false);

    }
  );


  it(
    'should return authentication response for valid credentials',
    async () => {

      const credentials = {
        email: 'admin@ems.com',
        password: 'Admin@123'
      };


      const response =
        await new Promise<any>(
          (resolve, reject) => {

            service
              .login(credentials)
              .subscribe({
                next: resolve,
                error: reject
              });

          }
        );


      expect(
        response.accessToken
      ).toBe(
        'mock-ems-access-token'
      );


      expect(
        response.userName
      ).toBe(
        'EMS Administrator'
      );

    }
  );


  it(
    'should reject invalid credentials',
    () => {

      service
        .login({
          email: 'wrong@ems.com',
          password: 'wrongpassword'
        })
        .subscribe({

          next: () => {
            throw new Error(
              'Login should have failed'
            );
          },

          error: (error) => {

            expect(error.message)
              .toBe(
                'Invalid email or password.'
              );

          }

        });

    }
  );


  it(
    'should save authenticated session',
    () => {

      service.saveSession({

        accessToken:
          'mock-ems-access-token',

        userName:
          'EMS Administrator'

      });


      expect(
        service.isLoggedIn()
      ).toBe(true);


      expect(
        service.getToken()
      ).toBe(
        'mock-ems-access-token'
      );


      expect(
        localStorage.getItem(
          'ems_access_token'
        )
      ).toBe(
        'mock-ems-access-token'
      );

    }
  );


  it(
    'should logout and clear session',
    () => {

      service.saveSession({

        accessToken:
          'mock-ems-access-token',

        userName:
          'EMS Administrator'

      });


      service.logout();


      expect(
        service.isLoggedIn()
      ).toBe(false);


      expect(
        service.getToken()
      ).toBeNull();


      expect(
        localStorage.getItem(
          'ems_access_token'
        )
      ).toBeNull();

    }
  );

});