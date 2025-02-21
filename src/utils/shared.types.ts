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
  passwordChangedAt?: string;
  deletedAt?: string;
}

export interface IAdmin extends Iuser {
  storeId?: string;
}

export interface IStore {
  image?: string;
  name?: string;
  nameAr?: string;
  location?: string;
  description?: string;
  descriptionAr?: string;
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
  nameAr?: string;
  description?: string;

  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IBrand {
  image?: string;
  name?: string;
  nameAr?: string;

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
  categoryType?: string;
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
  store?: IStore;
}

export interface ICartItem {
  id?: string;
  cartId?: string;
  productId?: string;
  price?: number;
  skuId?: string;
  sku?: any;
  Product?: IProduct;
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
  storeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICity {
  name?: string;
  nameAr?: string;
  createdAt?: string;
  updatedAt?: string;
  regions?: IRegion[];
  id?: string;
}

export interface IRegion {
  name?: string;
  nameAr?: string;
  cityId?: string;
  city?: ICity;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IUserProductFavourite {
  id?: string;
  userId?: string;
  productId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  rating?: number;
  message?: string;
  userId?: string;
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: Iuser;
  id?: string;
  product?: IProduct;
}

export interface IContactUs {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  contactType?: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export interface IFaqItem {
  id: any;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

export interface IAboutus {
  id?: string;
  ourMessage: string;
  ourMessageAr: string;
  ourVision: string;
  ourVisionAr: string;
  whoAreWe: string;
  whoAreWeAr: string;
  faqs?: IFaqItem[];
}

export interface IHomeSection {
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
}

export interface IHome {
  id?: string;
  title: string;
  titleAr: string;
  sections: IHomeSection[];
}
