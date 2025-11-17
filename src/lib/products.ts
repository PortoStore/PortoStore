export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
};

export const featuredProducts: Product[] = [
  {
    slug: "chaqueta-vaquera",
    name: "Chaqueta Vaquera Clásica",
    price: 89.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdawKCFkfKYaKeZyKc3N6TfOvQMyKlFtYCVPABjT4RvakU7Z4-k5IdNa_G9AAQFJeQSG03pYZB1xN3QZVFo2IRzU_lfSYkdcMoYZE8ETInZ3vKMsABuquL1j6G3G0Q753B8dJ-2YxLiNUImZEGSiQFkPp-1x1BcMmA3whbZyuY6SfqTm5_5Rs5Ym_jj7c99h7srhg4dwF1YQCM_lC-3pQfg-sDVcAVTlUrA60zj7LUH6Y7far7o6F2BQkoXsf_vn4LFkqRYWPoV56X",
  },
  {
    slug: "vestido-lino",
    name: "Vestido de Lino Veraniego",
    price: 74.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVQcJ3t0_Saz_ukiidciBvgdk8hwbW-yzFdokd3dLZnzX35SphQhUX09xGHhIn1Wnqh7tHKB_W7LNDuo2sObVSnnc0tJHGAi9iRENYwodWEuKhqmq5PkxpqKdf5qh_mq3G5NYArsCpiF_e3ThUR7-dXh-1_b9zSjEGU_k4zgYT4FP_o3EDh22PVWOzYm7dh3AoPltjvQ4d_bK-BWcNccwC9khh1C-qcyLEvDau-NNvaa0HoJ7B5BpAmVrDzJ0KRaUfQMtv5ybqgp4H",
  },
  {
    slug: "mochila-urbana",
    name: "Mochila Explorador Urbano",
    price: 120,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMElGkrvs4gP_IlQ_jStYHGp2QFCRfjfohkVXFpZovEk3EVsswbxsDPqeWrviWM7PS5EqReF4dirkCVTPSFfXPHFlaV5yfeVblj6CgxFiRGnDDUS8ef_VLAYGJA4Ojk3Aahi37ihjfjEvTx3GZy_Dmz-LD34MuBaccrK4lSwCQvJi3taSywPZtfthaguBv74zZaX5PMyNbFd-To_yA7OrMbCmr1QcpKOGkcYOdkbq6ohdGPVerIea7zRbz63hy-bsBlzzXVrFD4TMt",
  },
  {
    slug: "zapatilla-cuero",
    name: "Zapatilla Minimalista de Cuero",
    price: 150,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgp-km8RqowGrxftf5cJaF_YgB5cGty7mLBwnU9L7CKwruVJvyvU0mHavnxp86PSpBmIu4iXQS7ncZ3CWu48VIlZpKwmSNNE1Ik7iEjNP8S_Io5TuYfx6InOHRhDFpVuNlWLGJ5lCFX1qTZ0ftj46pKCb645YEzHYsDEoJLWpTUGjOBoRo3-iBBcrYDtcfNDvQkX0BUI1bkxv0mnnQiW-63HNzSgZjxK6_nhQhakG-rSExFOl8lwJNAbn1h23XrxKiLiCXS2T9NUGg",
  },
];