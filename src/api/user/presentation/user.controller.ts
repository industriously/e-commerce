import { Authorization } from '@COMMON/decorator/http';
import { UserUsecase, UserSchema } from '@INTERFACE/user';
import { Body, Controller, Delete, Get, Inject, Patch } from '@nestjs/common';
import { UserUsecaseToken } from '@USER/_constants_';
import typia from 'typia';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserUsecaseToken) private readonly userUsecase: UserUsecase,
  ) {}

  /**
   * 내 프로필 보기 API
   * @tag user
   */
  @Get()
  getProfile(
    @Authorization('bearer') token: string,
  ): Promise<UserSchema.Detail> {
    return this.userUsecase.getDetail(token);
  }

  /**
   * 내 정보 수정 API
   * @tag user
   */
  @Patch()
  updateProfile(
    @Authorization('bearer') token: string,
    @Body() body: UserUsecase.UpdateData,
  ): Promise<void> {
    const updateData = typia.assertPrune<UserUsecase.UpdateData>(body);
    return this.userUsecase.update(token, updateData);
  }

  /**
   * 내 계정 삭제 API
   * @tag user
   */
  @Delete()
  inActivate(@Authorization('bearer') token: string): Promise<void> {
    return this.userUsecase.remove(token);
  }
}
