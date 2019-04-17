class RequestErrorSerializer
  include FastJsonapi::ErrorSerializer

  attributes :title, :detail, :code, :status

end
