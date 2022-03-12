import Resource from "@/models/Resource";

export const getResourceName = (resource: Resource) => {
  switch (resource) {
    case Resource.Brick: {
      return "ladrillo";
    }
    case Resource.Grain: {
      return "trigo";
    }
    case Resource.Lumber: {
      return "madera";
    }
    case Resource.Ore: {
      return "piedra";
    }
    case Resource.Wool: {
      return "lana";
    }
  }
};
