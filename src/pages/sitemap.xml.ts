import type { APIRoute } from 'astro';
import {routes} from '../site';
export const GET:APIRoute=({site})=>new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(routes).flatMap(group=>Object.values(group)).map(path=>`<url><loc>${new URL(path,site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
