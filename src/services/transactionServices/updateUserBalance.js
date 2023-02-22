const { User } = require('../../schemas/users');

const updateUserBalance = async (userId, operationType, operationSum) => {
  try {
    const user = await User.findById(userId);
    let userBalance = user.balance;

    // if (operationType === 'expenses' && userBalance < operationType) {
    //   return { message: 'The balance is less than the amount spent' };
    // }

    switch (operationType) {
      case 'income':
        userBalance += operationSum;
        break;
      case 'expenses':
        userBalance -= operationSum;
        break;
      default:
        break;
    }

    const { balance: updatedUserBalance } = await User.findByIdAndUpdate(
      userId,
      { balance: userBalance },
      { new: true }
    );

    return updatedUserBalance;
  } catch (error) {
    return {
      message: 'Something went wrong in the user balance calculation',
      error,
    };
  }
};

module.exports = {
  updateUserBalance,
};
