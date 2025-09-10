import { Component, HostBinding, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

interface SidebarSection {
  title: string;
  items: MenuItem[];
  collapsedIcons: { icon: string; tooltip: string; routerLink?: any[] }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, PanelMenuModule, DividerModule, AvatarModule, ButtonModule, InputTextModule
    , TooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  expanded = signal(true);
  search = { placeholder: 'Pesquisar', tooltip: 'Pesquisar' };
  user = { name: 'Usuário', email: 'usuario@empresa.com' };

  isCollapsed() { return !this.expanded(); }
  showLabel() { return this.expanded(); }

  sections: SidebarSection[] = [
    {
      title: 'MAIN',
      items: [
        {
          label: 'Cadastros', // Pai 1
          items: [
            {
              label: 'Máquina', // Filho do pai 1
              items: [
                {
                  label: 'Tipo de Máquina', // Filho do filho do pai 1
                  routerLink: ['/pages/machine-type']

                }
              ]
            }
          ]
        }
      ],
      collapsedIcons: [
        { icon: 'pi pi-star', tooltip: 'Máquina' } // Pai 2 colapsado
      ]
    },
    {
      title: 'SETTINGS',
      items: [ 
        { label: 'Configurações', icon: 'pi pi-cog', routerLink: ['/settings/preferences'] } // Pai 2
      ],
      collapsedIcons: [
        { icon: 'pi pi-cog', tooltip: 'Configurações', routerLink: ['/settings/preferences'] } // Pai 2 colapsado
      ]
    },

  ];

  toggle() {
    this.expanded.update(v => !v);
    document.documentElement.style.setProperty(
      '--sidebar-w-current',
      this.expanded() ? 'var(--sidebar-w)' : 'var(--sidebar-w-collapsed)'
    );
    document.body.classList.toggle('blocked-scroll', this.expanded());
  }
}
