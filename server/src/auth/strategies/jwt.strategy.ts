import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthRequestPayLoad } from "../auth.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("SECRET_KEY"),
    });
  }

  async validate(payload: AuthRequestPayLoad) {
    const user = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    const { password, ...res } = user;
    return res;
  }
}
