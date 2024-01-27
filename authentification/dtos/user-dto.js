module.exports = class UserDto {
  phone;
  id;
  isActivated;

  constructor(model) {
    this.phone = model.phone;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
