class BankAccount {
  readonly userId: number;
  public userName: string;
  protected _userBalance: number;

  constructor(userId: number, userName: string, userBalance: number) {
    this.userId = userId;
    this.userName = userName;
    this._userBalance = userBalance;
  }

  //  addBalance(amount: number): void {
  //     this._userBalance += amount;
  //   }

  set deposit(amount: number) {
    this._userBalance += amount;
  }

  get balance(): number {
    return this._userBalance;
  }
}

class StudentBankAccount extends BankAccount {
  constructor(userId: number, userName: string, userBalance: number) {
    super(userId, userName, userBalance);
  }
  addBonus() {
    this.deposit = 100; // Using setter-style assignment to add bonus
  }
}

const account1 = new BankAccount(1, "Alice", 1000);
const account2 = new BankAccount(2, "Bob", 2000);
const studentAccount = new StudentBankAccount(3, "Charlie", 1500);

account1.deposit = 500;
account2.deposit = 1000;
studentAccount.addBonus();

console.log(account1.balance, account2.balance, studentAccount.balance);
