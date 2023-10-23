import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { SuccessResponse } from "src/common/successResponse";

@Controller("user")
export class UserController {
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  me(@Req() request: Request) {
    return SuccessResponse({ data: request.user });
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("upload-avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    console.log("upload: ", file);
  }
}
