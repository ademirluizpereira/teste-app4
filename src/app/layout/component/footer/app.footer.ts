import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `
    <div class="layout-footer">
      Copyright 2025  ©
      <a
        href="http://papersolutions.com.br"
        target="_blank"
        rel="noopener noreferrer"
        class="font-bold hover:underline"
      >
        Paper Solutions
      </a>
    </div>
  `,
})
export class AppFooter {}
