import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Services } from './services/services';
import { About } from './about/about';
import { Skills } from './skills/skills';
import { Experience } from './experience/experience';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Contact } from './contact/contact';

export const routes: Routes = [
    {
        path: '',
        redirectTo:'Home',
        pathMatch: 'full'
    },
    {
       path: 'Home',
       component:Home 
    },
    {
       path: 'Services',
       component:Services 
    },
    {
       path: 'About',
       component:About 
    },
    {
       path: 'Skills',
       component:Skills 
    },
    {
       path: 'Experience',
       component:Experience 
    },
    {
       path: 'Header',
       component:Header 
    },
    {
       path: 'Footer',
       component:Footer 
    },
    {
       path: 'Contact',
       component:Contact 
    },
];
