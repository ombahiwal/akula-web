import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

const SPACE_ID = import.meta.env.VITE_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master`;

export const getContent = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/entries`, {
      params: {
        access_token: ACCESS_TOKEN,
        include: 2, // include linked assets
      },
    });
    
    const assetsMap = {};
    (response.data.includes?.Asset || []).forEach((asset) => {
      assetsMap[asset.sys.id] = asset.fields.file?.url
        ? `https:${asset.fields.file.url}`
        : null;
    });

    const resolveField = (field) => {
      if (Array.isArray(field)) {
        return field.map(resolveField);
      } else if (field?.sys?.type === "Link" && field.sys.linkType === "Asset") {
        return assetsMap[field.sys.id] || null;
      } else if (typeof field === "object") {
        const obj = {};
        for (const key in field) {
          obj[key] = resolveField(field[key]);
        }
        return obj;
      }
      return field;
    };

        // Map entries and resolve asset links
        const mappedResult = response.data.items.map((item) => ({
        id: item.sys.id,
        contentType: item.sys.contentType.sys.id,
        fields: resolveField(item.fields),
        }));

        // Sort by fields.order (ascending)
        const sortedResult = mappedResult.sort(
        (a, b) => (a.fields.order || 0) - (b.fields.order || 0)
        );

        // Group by contentType into a dictionary
        const groupedByContentType = sortedResult.reduce((acc, item) => {
        const type = item.contentType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
        }, {});

        // console.log(groupedByContentType);


    return groupedByContentType;
  } catch (error) {
    console.error("Error fetching from Contentful:", error);
    return [];
  }
};
