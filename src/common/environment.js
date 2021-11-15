class environment {
  ALCHEMY_API_KEY;

  init(env) {
    this.ALCHEMY_API_KEY = env.ALCHEMY_API_KEY;
  }

  getAlchemyKey() {
    return this.ALCHEMY_API_KEY;
  }
}

export default new environment();
