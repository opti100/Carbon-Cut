import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://carboncut.co',
      lastModified: new Date(),
    },
    {
      url: 'https://carboncut.co/calculator',
      lastModified: new Date(),
    },
    {
        url: 'https://carboncut.co/internet',
        lastModified: new Date(),
    },
     {
        url: 'https://www.carboncut.co/internet/internet-ads',
        lastModified: new Date(),
    },
    {
        url: 'https://www.carboncut.co/internet/web-&-apps',
        lastModified: new Date(),
    },
    {
        url: 'https://www.carboncut.co/oil-and-natural-gas',
        lastModified: new Date(),
    },
    {
        url: 'https://www.carboncut.co/oil-and-natural-gas/lubricant',
        lastModified: new Date(),
    }
];
}