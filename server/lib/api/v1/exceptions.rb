module Api
  module V1
    module Exceptions
      class Error < StandardError
        attr_accessor :code, :status, :title, :detail, :href

        def initialize(code:, status:, title:, detail:, href:)
          @code = code
          @status = status
          @title = title
          @detail = detail
          @href = href
        end
      end

      class WrongContentTypeError < Error
        def initialize
          super code: 1001, status: 415, title: "Unsupported Media Type", detail: "Content Type must be application/vnd.api+json", href: "https://github.com/nervosnetwork/ckb-explorer"
        end
      end

      class WrongAcceptError < Error
        def initialize
          super code: 1002, status: 406, title: "Not Acceptable", detail: "Accept must be application/vnd.api+json", href: "https://github.com/nervosnetwork/ckb-explorer"
        end
      end

    end
  end
end
