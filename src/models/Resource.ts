export enum Resource {
  Brick = "Brick",
  Lumber = "Lumber",
  Wool = "Wool",
  Grain = "Grain",
  Ore = "Ore",
}

export const getResourceIcon = (resource: Resource): string => {
  switch (resource) {
    case Resource.Brick: {
      return "🧱";
    }
    case Resource.Lumber: {
      return "🪵";
    }
    case Resource.Wool: {
      return "🐑";
    }
    case Resource.Grain: {
      return "🌾";
    }
    case Resource.Ore: {
      return "🪨";
    }
  }
};

export default Resource;
