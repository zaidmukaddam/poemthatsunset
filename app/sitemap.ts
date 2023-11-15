import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  return [
    {
      url: "https://poemthatsunset.za16.co",
      lastModified: new Date(),
    }
  ];
}
