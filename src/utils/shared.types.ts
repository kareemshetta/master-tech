export interface Iuser {
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  email?: string;
  password?: string;
  status?: string;
  otp?: string;
  otpCreatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  cart?: ICart;
  cartId?: string;
}

export interface IAdmin extends Iuser {
  storeId?: string;
}

export interface IStore {
  image?: string;
  name?: string;
  location?: string;
  description?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  parentId?: string;
  subStores?: IStore[];
  parentStore?: IStore;
  cityId?: string;
  regionId?: string;
  city?: ICity;
  region?: IRegion;
}

export interface ICategory {
  image?: string;
  name?: string;

  description?: string;

  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IBrand {
  image?: string;
  name?: string;

  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IAttributes {
  type?: string;
  value?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IScreen {
  size?: string;
  refreshRate?: string;
  pixelDensity?: string;
  aspectRatio?: string;
  type?: string;
  details?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IProcessor {
  type?: string;
  noOfCores?: string;
  details?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface ISku {
  id?: string;
  name?: string;
  price?: number;
  discount?: number;
  storeId?: string;
  productId?: string;
  colorAttributeId?: string;
  storageAttributeId?: string;
  color?: IAttributes;
  storage?: IAttributes;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProduct {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  storeId?: string;
  screenId?: string;
  processorId?: string;
  categoryId?: string;
  brandId?: string;
  attributes?: IAttributes[];
  screen?: IScreen;
  processor?: IProcessor;
  skus?: ISku[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MulterRequest extends Request {
  file: any;
  files: any[];
}

export interface ICart {
  id?: string;
  userId?: string;
  cart_items?: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartItem {
  id?: string;
  cartId?: string;
  productId?: string;
  price?: number;
  skuId?: string;
  sku?: any;

  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItem extends ICartItem {
  orderId?: string;
  order?: any;
}

export interface IOrder {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  status?: string;
  totalAmount?: number | string;
  shippingAddress?: string;
  paymentStatus?: string;
  orderItems?: IOrderItem[];
  shortId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICity {
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  regions?: IRegion[];
  id?: string;
}

export interface IRegion {
  name?: string;
  cityId?: string;
  city?: ICity;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}
