import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor() {}

  getMessage(route: ActivatedRoute): string | null {
    let currentRoute = route.snapshot;

    // Traverse the route hierarchy to find the deepest activated route
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute.paramMap.get('message');
  }
}
