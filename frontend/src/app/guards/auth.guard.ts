import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth-service";
import { map, catchError, of } from "rxjs";

//décide si un utilisateur a le droit d'accès
export const authGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.checkAuth().pipe(
        map(res => {
            if (res.authenticated) {
                return true;
            }
            router.navigate(["/sign-in"]);
            return false;
        }),
        catchError(() => {
            router.navigate(["/sign-in"]);
            return of(false);
        })
    );
};